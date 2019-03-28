from flask import Flask, render_template, request, Response, send_from_directory, redirect, url_for, jsonify, abort
import spyce
import os, json

CURRENT_PATH = os.path.abspath(os.path.dirname(os.path.realpath(__file__)))
template_path = os.path.abspath(CURRENT_PATH + "/dist")
app = Flask(__name__, template_folder=template_path, static_url_path='', static_folder=None)
spy = spyce.spyce()
BSP_FILENAME = "spacecraft.bsp"
TRAJECTORY_FOLDER = CURRENT_PATH + "/data/trajectory/"
spy_loaded = False
kernels = []
main_subject = None
main_subject_name = ""

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

@app.route('/api/all_objects', methods=['GET'])
def get_all_objects():
    jsonResponse = []
    time = request.args.get('time')
    frame_data_requested = time != None
    id = None
    if (frame_data_requested):
        time = float(time)
    for k in kernels:
        spy.main_file = k
        try:
            for id in spy.get_objects():
                celestialObj = {}
                celestialObj['id'] = id
                if (frame_data_requested):
                    frame = spy.get_frame_data(id, 399, time)
                    frame_as_dict = frame_to_dict(frame)
                    celestialObj['frame'] = frame_as_dict
                name = ""
                if id == main_subject:
                    name = main_subject_name
                else:
                    try:
                        name = spyce.id_to_str(id)
                    except:
                        print("[ERROR]: NAIF not found")
                celestialObj['name'] = name
                jsonResponse.append(celestialObj)
        except spyce.InternalError:
            #thrown when kernel does not have objects, like leapseconds
            pass
        except spyce.InsufficientDataError:
            #An object does not have frame data for this instant
            print("[WARN]: object %s does not have data for %s" % (id, time))
    return jsonify(jsonResponse)

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

@app.route('/api/toJ2000', methods=['GET'])
def toJ2000():
    time = request.args.get("time")
    if time == None:
        abort(400)
    try:
        ret = spy.utc_to_et(time)
        jsonObj = {}
        jsonObj["UTC"] = time
        jsonObj["J2000"] = ret
        return jsonify(jsonObj)
    except spyce.InvalidArgumentError:
        abort(400)
    except spyce.InternalError:
        abort(500)

@app.route('/api/toUTC', methods=['GET'])
def toUTC():
    time = request.args.get("time")
    if time == None:
        abort(400)
    try:
        time = float(time)
        ret = spy.et_to_utc(time, "ISOC")
        jsonObj = {}
        jsonObj["UTC"] = ret
        jsonObj["J2000"] = time
        return jsonify(jsonObj)
    except ValueError:
        abort(400)
    except spyce.InvalidArgumentError:
        abort(400)
    except spyce.InternalError:
        abort(500)

if __name__ == '__main__':
    try:
        load_config()
    except:
        print ("[ERROR]: Unable to load config")
    port = os.getenv('PORT', 5000)
    host = '0.0.0.0'

    app.run(host=host, port=port)