from flask import Flask, render_template, request, Response, send_from_directory, redirect, url_for, jsonify
from flask import abort
from spyce import spyce
import os, json

CURRENT_PATH = os.path.abspath(os.path.dirname(os.path.realpath(__file__)))
template_path = os.path.abspath(CURRENT_PATH + "/dist")
app = Flask(__name__, template_folder=template_path, static_url_path='', static_folder=None)
spy = spyce.spyce()
BSP_FILENAME = "spacecraft.bsp"
TRAJECTORY_FOLDER = CURRENT_PATH + "/data/trajectory/"
spy_loaded = False
kernels = []

def load_config():
    with open('config/config.json') as conf_file:
        conf_data = json.load(conf_file)
        for kern in conf_data['kernels']:
            kernel_filepath = "config/kernels/" + kern
            spy.add_kernel(kernel_filepath)
            kernels.append(kernel_filepath)


@app.route('/')
def root():
    return redirect("/index.html")


@app.route('/spacecraft/pos', methods=['GET'])
def get_spacecraft_pos():
    return "TODO"

@app.route('/api/all_objects', methods=['GET'])
def get_all_objects():
    jsonResponse = []
    time = request.args.get('time')
    time = float(time)
    for k in kernels:
        spy.main_file = k
        for id in spy.get_objects():
            frame = spy.get_frame_data(id, 399, time)
            frame_as_dict = frame_to_dict(frame)
            celestialObj = {}
            celestialObj['id'] = id
            #TODO: add john's idtoname
            celestialObj['frame'] = frame_as_dict
            jsonResponse.append(celestialObj)
    spy.main_file = main_kernel
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

@app.route('/api/toJ2000')
def toJ2000():
    time = request.args.get("time")
    print(time)
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


@app.route('/api/toUTC')
def toUTC():
    time = request.args.get("time")
    if time == None:
        abort(400)
    try:
        ret = spy.et_to_utc(time, "ISOC")
        jsonObj = {}
        jsonObj["UTC"] = ret
        jsonObj["J2000"] = time
        return jsonify(jsonObj)
    except:
        abort(400)

if __name__ == '__main__':
    try:
        load_config()
    except:
        print ("[ERROR]: Unable to load config")
    port = os.getenv('PORT', 5000)
    host = '0.0.0.0'

    app.run(host=host, port=port)


