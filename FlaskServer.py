from flask import (Flask, render_template, request, Response, send_from_directory, redirect, url_for, jsonify, abort,
                   json)
import spyce
import os

CURRENT_PATH = os.path.abspath(os.path.dirname(os.path.realpath(__file__)))
template_path = os.path.abspath(CURRENT_PATH + "/dist")
app = Flask(__name__, template_folder=template_path, static_url_path='', static_folder=None)
spy = spyce.spyce()
main_kernel_filepath = ""
TRAJECTORY_FOLDER = CURRENT_PATH + "/config/spyce_files/trajectory/"
kernels = []
main_subject = None
main_subject_name = ""
EARTH = 399

def load_config():
    with open('config/config.json') as conf_file:
        conf_data = json.load(conf_file)
        for kern in conf_data['kernels']:
            kernel_filepath = "config/kernels/" + kern
            spy.add_kernel(kernel_filepath)
            kernels.append(kernel_filepath)
        global main_subject
        global main_subject_name
        main_subject = conf_data['main_subject']
        main_subject_name = conf_data['subject_name']

@app.route('/')
def root():
    return redirect("/index.html")


@app.route('/api/spacecraft/pos', methods=['GET'])
def get_spacecraft_pos():
    return "TODO"

@app.route('/api/main_object', methods=['GET'])
def get_main_id():
    jsonResponse = {}
    jsonResponse['id'] = main_subject
    jsonResponse['name'] = main_subject_name
    return jsonify(jsonResponse)

"""
parameters: 
id, required. id of object you want info about
time, optional. time for which you want frame data about (provides no frame data by default.)
observer, optional. NAIF id on which to base frame data coordinates (defaults to Earth: 399)
"""
@app.route('/api/objects/<object_identifier>', methods=['POST'])
def get_object(object_identifier):
    req_json = request.get_json()
    time = req_json.get('time', None)
    observer = req_json.get('observer', EARTH)
    try:
        object_id = int(object_identifier)
    except ValueError:
        abort(400, "object_identifier is not an int")
    return jsonify(get_objects(time=time, observer=observer, object_id=object_id))

@app.route('/api/all_objects', methods=['POST'])
def get_all_objects():
    req_json = request.get_json()
    time = req_json['time']
    observer = req_json['observer']
    if observer == None:
        observer = EARTH
    return jsonify(get_objects(time=time, observer=observer))

@app.route('/<path:filename>', methods=['GET'])
def get_file(filename):
    return send_from_directory('dist', filename)

def frame_to_dict(frame):
    frameDict = {}
    frameDict['x'] = frame.x
    frameDict['y'] = frame.y
    frameDict['z'] = frame.z
    frameDict['dx'] = frame.dx
    frameDict['dy'] = frame.dy
    frameDict['dz'] = frame.dz
    return frameDict

def get_objects(**kwargs):
    #Get and validate arguments.
    time = kwargs.get('time', None)
    if time != None:
        try:
            time = float(time)
        except:
            abort(400, "time is not a number.")
            return
    object_id = kwargs.get('object_id', None)
    if object_id != None:
        try:
            object_id = int(object_id)
        except:
            abort(400, 'id is not an int')
    observer = kwargs.get('observer', EARTH)
    try:
        observer = int(observer)
    except:
        abort(400, 'observer is not an int')

    #ret is only returned if all objects are requested.
    ret = []
    frame_data_requested = time != None
    all_objects_requested = object_id == None
    for k in kernels:
        spy.main_file = k
        try:
            for id in spy.get_objects():
                if not all_objects_requested and id != object_id:
                    continue
                celestialObj = {}
                celestialObj['id'] = id
                if (frame_data_requested):
                    try:
                        frame = spy.get_frame_data(id, observer, time)
                        frame_as_dict = frame_to_dict(frame)
                        celestialObj['frame'] = frame_as_dict
                    except spyce.InsufficientDataError:
                        #this kernel does not have coverage for this object
                        continue
                name = ""
                if id == main_subject:
                    name = main_subject_name
                else:
                    try:
                        name = spyce.id_to_str(id)
                    except:
                        print("[ERROR]: NAIF not found: ", id)
                celestialObj['name'] = name
                if all_objects_requested:
                    ret.append(celestialObj)
                else:
                    return celestialObj
            """
            except spyce.InternalError:
                #thrown when kernel does not have objects, like leapseconds
                print("[ERROR]: spyce does not have enough info to properly calculate request.")
                
                pass
            """
        except spyce.InsufficientDataError:
            #An object does not have frame data for this instant in this kernel.
            print("[WARN]: object %s does not have data for %s" % (id, time))
        except spyce.InternalError:
            #can occur when calling get_objects on the leapseconds kernel.
            pass

    if not all_objects_requested:
        abort(404, "Unable to find object.")

    return ret

if __name__ == '__main__':
    try:
        load_config()
    except:
        print ("[ERROR]: Unable to load config")
    print (kernels)
    port = os.getenv('PORT', 5000)
    host = '0.0.0.0'

    app.run(host=host, port=port)