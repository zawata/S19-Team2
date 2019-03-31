from flask import (Flask, render_template, request, Response, send_from_directory, redirect, url_for, jsonify, abort,
                   json)
import spyce
import os
app = Flask(__name__, static_url_path='', static_folder=None)
kernels = []
main_subject_id = None
main_subject_name = ""
EARTH = 399

def load_config():
    global main_subject_id
    global main_subject_name
    with open('config/config.json') as conf_file:
        conf_data = json.load(conf_file)
        for kern in conf_data['kernels']:
            kernel_filepath = "config/kernels/" + kern
            spyce.add_kernel(kernel_filepath)
            kernels.append(kernel_filepath)
        main_subject_id = conf_data['main_subject_id']
        main_subject_name = conf_data['main_subject_name']

@app.route('/')
def root():
    return redirect("/index.html")

@app.route('/api/main', methods=['GET'])
def get_main_id():
    return jsonify(id_and_name_dict(main_subject_id, main_subject_name))

@app.route('/api/objects', methods=['GET'])
def get_all_objects():
    jsonResponse = []
    id = None
    for k in kernels:
        try:
            for id in spyce.get_objects(k):
                celestialObj = {}
                celestialObj['id'] = id
                name = ""
                if id == main_subject_id:
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
    return jsonify(jsonResponse)

@app.route('/api/objects/<object_identifier>', methods=['GET'])
def handle_get_object_request(object_identifier):
    return jsonify(get_object(object_identifier))

@app.route('/api/objects/<object_identifier>/frames', methods=['POST'])
def get_frame_data(object_identifier):
    obj = get_object(object_identifier)
    req_json = request.get_json()
    utc_times = req_json.get('times', None)
    if utc_times == None:
        abort(400, "Times argument missing.")
    elif not isinstance(utc_times, list):
        abort(400, "Times is not a list.")
    times_in_J2000 = {}
    for t in utc_times:
        try:
            J2000time = spyce.utc_to_ec(t)
            times_in_J2000[t] = J2000time
        except spyce.InternalError:
            print("[WARN]: unknown error parsing date: ", t)
        except spyce.InvalidDateString:
            print("[WARN]: Recieved invalid date string; ", t)
    observer = req_json.get('observer', EARTH)
    frames = []

    for kernel in kernels:
        for utc, J2000 in range(len(times_in_J2000)):
            try:
                frame = frame_to_dict(spyce.get_frame_data(kernel, obj['id'], observer, J2000))
                framedata = {}
                framedata['date'] = utc
                framedata['frame'] = frame
                frames.append(framedata)
            except (spyce.InternalError, spyce.InsufficientDataError):
                #object not found in this kernel or at this time.
                pass
    return jsonify(frames)

def get_object(identifier):
    jsonResponse = {}
    given_id = False
    obj_name = None
    obj_id = None
    try:
        obj_id = int(identifier)
        given_id = True
    except ValueError:
        obj_name = identifier

    if obj_id == main_subject_id:
        jsonResponse = id_and_name_dict(obj_id, main_subject_name)
    elif obj_name == main_subject_name:
        jsonResponse = id_and_name_dict(main_subject_id, obj_name)
    else:
        try:
            if given_id:
                obj_name = spyce.id_to_str(obj_id)
            else:
                obj_id = spyce.str_to_id(obj_name)
            jsonResponse = id_and_name_dict(obj_id, obj_name)
        except spyce.InternalError:
            abort(404, "SPICE object not found.")
        except spyce.IDNotFoundError:
            abort(404, "SPICE object not found.")
    return jsonResponse

def id_and_name_dict(id, name):
    ret = {}
    ret['id'] = id
    ret['name'] = name
    return ret

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

@app.route('/api/convert/et', methods=['POST'])
def toJ2000():
    req_json = request.get_json()
    time = req_json.get("time", None)
    if time == None:
        abort(400, "Must specify time")
    try:
        ret = spy.utc_to_et(time)
        jsonObj = {}
        jsonObj["UTC"] = time
        jsonObj["J2000"] = ret
        return jsonify(jsonObj)
    except spyce.InvalidArgumentError:
        abort(400, "Invalid Time String")
    except spyce.InternalError:
        abort(500)

@app.route('/api/convert/utc', methods=['POST'])
def toUTC():
    req_json = request.get_json()
    time = req_json.get("time", None)
    if time == None:
        abort(400, "Must specify time")
    try:
        time = float(time)
        ret = spy.et_to_utc(time, "ISOC")
        jsonObj = {}
        jsonObj["UTC"] = ret
        jsonObj["J2000"] = time
        return jsonify(jsonObj)
    except ValueError:
        abort(400, "Time is not in J2000 format: must be a float")
    except spyce.InvalidArgumentError:
        abort(400, "J2000 value is inappropriate.")
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