from flask import (Flask, render_template, request, Response, send_from_directory, redirect, url_for, jsonify, abort,
                   json)
import spyce
import os

app = Flask(__name__, template_folder=template_path, static_url_path='', static_folder=None)
kernels = []
main_subject = None
main_subject_name = ""
EARTH = 399

def load_config():
    global main_subject
    global main_subject_name
    with open('config/config.json') as conf_file:
        conf_data = json.load(conf_file)
        for kern in conf_data['kernels']:
            kernel_filepath = "config/kernels/" + kern
            spyce.add_kernel(kernel_filepath)
            kernels.append(kernel_filepath)
        main_subject = conf_data['main_subject']
        main_subject_name = conf_data['subject_name']

@app.route('/')
def root():
    return redirect("/index.html")

@app.route('/api/main_object', methods=['GET'])
def get_main_id():
    jsonResponse = {}
    jsonResponse['id'] = main_subject
    jsonResponse['name'] = main_subject_name
    return jsonify(jsonResponse)

@app.route('/api/objects', methods=['GET'])
def get_all_objects():
    jsonResponse = []
    time = request.args.get('time')
    frame_data_requested = time != None
    id = None
    if (frame_data_requested):
        time = float(time)
    for k in kernels:
        try:
            for id in spyce.get_objects(k):
                celestialObj = {}
                celestialObj['id'] = id
                if (frame_data_requested):
                    frame = spyce.get_frame_data(k, id, 399, time)
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

@app.route('/api/objects/<object_identifier>', methods=['GET'])
def get_object(object_identifier):
    jsonResponse = {}
    given_id = False
    obj_name = None
    obj_id = None
    try:
        obj_id = int(object_identifier)
        given_id = True
    except ValueError:
        obj_name = object_identifier

    if obj_id == main_subject:
        jsonResponse = id_and_name_dict(obj_id, main_subject_name)
    elif obj_name == main_subject_name:
        jsonResponse = id_and_name_dict(main_subject, obj_name)
    else:
        try:
            if not given_id:
                obj_id = spyce.str_to_id(obj_name)
            jsonResponse = id_and_name_dict(obj_id, obj_name)
        except spyce.InternalError:
            abort(500)
    return jsonify(jsonResponse)

@app.route('/api/objects/<object_identifier>/frame', methods=['GET'])
def get_frame_data(object_identifier):
    obj = get_object(object_identifier)
    req_json = request.get_json()
    utc_times = req_json['times']
    times = []
    for t in utc_times:
        try:
            times.append(spyce.utc_to_ec(t))
        except spyce.InternalError:
            abort(500)
        except:
            abort(400)
    observer = req_json['observer']
    frames = {}
    if observer == None:
        observer = EARTH

    for k in kernels:
            for t in times:
                try:
                    frame = frame_to_dict(spyce.get_frame_data(k, obj['id'], observer, t))
                    frames[t] = frame
                except (spyce.InternalError, spyce.InsufficientDataError):
                    pass
    return jsonify(frames)

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

if __name__ == '__main__':
    try:
        load_config()
    except:
        print ("[ERROR]: Unable to load config")
    port = os.getenv('PORT', 5000)
    host = '0.0.0.0'

    app.run(host=host, port=port)