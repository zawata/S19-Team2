from flask import (Flask, request, send_from_directory, redirect, jsonify, abort, json)
import spyce
import os

EARTH = 399

app = Flask(__name__)
kernels = []
main_subject_id = None
main_subject_name = ""

#
# Helper Functions
#

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

def get_object(identifier):
    obj_name = None
    obj_id = None
    try:
        obj_id = int(identifier)
    except ValueError:
        obj_name = identifier

    if obj_id == main_subject_id or obj_name == main_subject_name or obj_name == "main":
        return id_and_name_dict(main_subject_id, main_subject_name)
    else:
        try:
            if obj_id:
                obj_name = spyce.id_to_str(obj_id)
            else:
                obj_id = spyce.str_to_id(obj_name)
            return id_and_name_dict(obj_id, obj_name)
        except spyce.InternalError:
            abort(404, "SPICE object not found.")
        except spyce.IDNotFoundError:
            abort(404, "SPICE object not found.")

def id_and_name_dict(obj_id, name):
    return {
        'id': obj_id,
        'name': name
    }

def frame_to_dict(frame):
    return {
        'x': frame.x,
        'y': frame.y,
        'z': frame.z,
        'dx': frame.dx,
        'dy': frame.dy,
        'dz': frame.dz
    }

#
# API Endpoints
#

@app.route('/')
def root():
    return redirect("/index.html")

@app.route('/<path:filename>', methods=['GET'])
def get_file(filename):
    return send_from_directory('dist', filename)

@app.route('/api/objects', methods=['GET'])
def get_all_objects():
    """
        returns an array of <SPICE_object>
    """
    jsonResponse = []
    for k in kernels:
        try:
            for obj_id in spyce.get_objects(k):
                jsonResponse.append(get_object(obj_id))
        except spyce.InternalError:
            #Happens when trying get_objects on kernels that don't have objects: leapseconds for example
            pass
    return jsonify(jsonResponse)

@app.route('/api/objects/<object_identifier>', methods=['GET'])
def handle_get_object_request(object_identifier):
    """
        returns: <SPICE_object>
    """
    return jsonify(get_object(object_identifier))

@app.route('/api/objects/<object_identifier>/coverage', methods=['GET'])
def get_coverage_window(object_identifier):
    """
        returns <coverage_window>:
        {
            start: <ISO_8601 string>
            end: <ISO_8601 string>
        }
    """

    NAIF_id = get_object(object_identifier)['id']
    windows_piecewise = []
    for k in kernels:
        try:
            windows_piecewise += spyce.get_coverage_windows(k, NAIF_id)
            windows_piecewise.sort(key=lambda x: x[0])
        except spyce.InternalError:
            #object does not exist in this kernel.
            pass
    if len(windows_piecewise) > 0:
        return jsonify({
            'start': windows_piecewise[0][0],
            'end': windows_piecewise[-1][1]
        })
    else:
        abort(404, "No Coverage found")

@app.route('/api/objects/<object_identifier>/frames', methods=['POST'])
def get_frame_data(object_identifier):
    """
        input:
        {
            times: array of <ISO_8601 strings>
        }

        returns: array of <frame_data_object>
        [
            {
                date: <ISO_8601 string>,
                frame: <frame_object>
            }
        ]

        frame_object:
        {
            x: float
            y: float
            z: float
            dx: float
            dy: float
            dz: float
        }
    """
    obj_id = get_object(object_identifier)['id']
    req_json = request.get_json()
    utc_times = req_json.get('times', None)
    if utc_times == None or not isinstance(utc_times, list):
        abort(400, "Invalid Argument")

    times_in_J2000 = {}
    for t in utc_times:
        try:
            J2000time = spyce.utc_to_et(t)
            times_in_J2000[t] = J2000time
        except spyce.InternalError:
            print("[WARN]: unknown error parsing date: ", t)
    observer = req_json.get('observer', EARTH)
    frames = []

    for utc, J2000 in times_in_J2000.items():
        try:
            frame = frame_to_dict(spyce.get_frame_data(obj_id, observer, J2000))
            frames.append({
                'date': utc,
                'frame': frame
            })
        except (spyce.InternalError, spyce.InsufficientDataError):
            #object not found in this kernel or at this time.
            pass
    return jsonify(frames)

@app.route('/api/convert/et', methods=['POST'])
def toJ2000():
    """
        input:
        {
            utc_time: <ISO_8601 string>
        }
        returns: <time_convert_obj>

        time_conver_obj: {
            UTC: <ISO_8601 string>
            J2000: <float>
        }
    """
    req_json = request.get_json()
    if req_json == None:
        abort(400, "Missing json request body")
    time = req_json.get("utc_time", None)
    if time == None:
        abort(400, "utc_time param missing")

    try:
        return jsonify({
            'UTC': time,
            'J2000': spyce.utc_to_et(time)
        })
    except spyce.InvalidArgumentError:
        abort(400, "Invalid Time String")
    except spyce.InternalError:
        abort(500)

@app.route('/api/convert/utc', methods=['POST'])
def toUTC():
    """
        input:
        {
            et_time: <float>
        }
        returns: <time_convert_obj>

        time_conver_obj: {
            UTC: <ISO_8601 string>
            J2000: <float>
        }
    """
    req_json = request.get_json()
    if req_json == None:
        abort(400, "missing json request body")
    time = req_json.get("et_time", None)
    if time == None:
        abort(400, "et_time field missing")
    try:
        return jsonify({
            'UTC': spyce.et_to_utc(time, "ISOC"),
            'J2000': float(time)
        })
    except ValueError:
        abort(400, "Time is not in J2000 format: must be a float")
    except spyce.InvalidArgumentError:
        abort(400, "J2000 value is inappropriate.")
    except spyce.InternalError:
        abort(500)

if __name__ == '__main__':
    try:
        load_config()
    except Exception as e:
        print ("[ERROR]: Unable to load config")

    port = os.getenv('PORT', 5000)
    host = '0.0.0.0'

    app.run(host=host, port=port)