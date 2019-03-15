from flask import Flask, render_template, request, Response, send_from_directory, redirect, url_for, jsonify, abort
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

@app.route('/api/all_objects', methods=['GET'])
def get_all_objects():
    jsonResponse = []
    time = request.args.get('time')
    frame_data_requested = time != None
    if (frame_data_requested):
        time = float(time)
    for k in kernels:
        spy.main_file = k
        for id in spy.get_objects():
            celestialObj = {}
            celestialObj['id'] = id
            # TODO: add john's idtoname
            if (frame_data_requested):
                frame = spy.get_frame_data(id, 399, time)
                frame_as_dict = frame_to_dict(frame)
                celestialObj['frame'] = frame_as_dict
            jsonResponse.append(celestialObj)
    return jsonify(jsonResponse)


#code derived from http://flask.pocoo.org/docs/1.0/patterns/fileuploads/
#Apparently, sponsor will not be using our server to upload files.
"""
@app.route('/data/trajectory', methods=['GET', 'POST'])
def change_trajectory_file():
    if request.method == 'POST':
        if 'file' not in request.files:
            print ("[WARN]: No file recieved.")
            return redirect(request.url)
        file = request.files['file']
        if file.filename == '':
            print ("[WARN]: No file selected.")
            return redirect(request.url)
        if file and file.filename[-4:] == ".bsp":
            file.save(os.path.join(TRAJECTORY_FOLDER, BSP_FILENAME))
            #TODO: replace with actual webpages
            try:
                load_spacecraft_bsp()
                return "File change successful!"
            except:
                return "Unable to use BSP file"
        print ("[WARN]: improper file format")

    #TODO: replace with actual webpage.
    return '''
        <!doctype html>
        <title>Upload new File</title>
        <h1>Upload new File</h1>
        <form method=post enctype=multipart/form-data>
          <input type=file name=file>
          <input type=submit value=Upload>
        </form>
        '''
"""

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

@app.route('/api/toUTC', methods=['GET'])
def toUTC():
    time = request.args.get("time")
    print (time)
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
    #print(app.url_map)
    try:
        load_config()
    except:
        print ("[ERROR]: Unable to load config")
    port = os.getenv('PORT', 5000)
    host = '0.0.0.0'

    app.run(host=host, port=port)