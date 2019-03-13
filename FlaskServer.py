from flask import Flask, render_template, request, Response, send_from_directory, redirect, url_for, jsonify
from spyce import spyce
import os, json

CURRENT_PATH = os.path.abspath(os.path.dirname(os.path.realpath(__file__)))
template_path = os.path.abspath(CURRENT_PATH + "/dist")
app = Flask(__name__, template_folder=template_path, static_url_path='', static_folder=None)
spy = spyce.spyce()
main_kernel_filepath = ""
TRAJECTORY_FOLDER = CURRENT_PATH + "/config/spyce_files/trajectory/"
kernels = []
main_subject = None

def load_config():
    with open('config/config.json') as conf_file:
        conf_data = json.load(conf_file)
        print(conf_data['kernels'])
        for kern in conf_data['kernels']:
            kernel_filepath = "config/kernels/" + kern
            spy.add_kernel(kernel_filepath)
            kernels.append(kernel_filepath)
        global main_subject
        main_subject = conf_data['main_subject']

@app.route('/')
def root():
    return redirect("/index.html")


@app.route('/api/spacecraft/pos', methods=['GET'])
def get_spacecraft_pos():
    return "TODO"

@app.route('/api/main_id', methods=['GET'])
def get_main_id():
    jsonResponse = {}
    jsonResponse['id'] = main_subject
    return jsonify(jsonResponse)

@app.route('/api/all_objects', methods=['GET'])
def get_all_objects():
    jsonResponse = []
    time = request.args.get('time')
    time = float(time)
    print (kernels)
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

if __name__ == '__main__':
    #print(app.url_map)
    try:
        load_config()
    except:
        print ("[ERROR]: Unable to load config")
    port = os.getenv('PORT', 5000)
    host = '0.0.0.0'

    app.run(host=host, port=port)


