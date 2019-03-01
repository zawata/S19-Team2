from flask import Flask, render_template, request, Response, send_from_directory, redirect, url_for, jsonify
import spyce
import os, json, fnmatch

CURRENT_PATH = os.path.abspath(os.path.dirname(os.path.realpath(__file__)))
template_path = os.path.abspath(CURRENT_PATH + "/dist")
app = Flask(__name__, template_folder=template_path, static_url_path='', static_folder=None)
spy = spyce.spyce()
BSP_FILENAME = "spacecraft.bsp"
TRAJECTORY_FOLDER = CURRENT_PATH + "/data/trajectory/"
spy_loaded = False

astral_names = {
    10: "SUN",
    399: "EARTH"
}

#loading initial file for spy
#snippet derived from https://stackoverflow.com/questions/1724693/find-a-file-in-python
def load_spacecraft_bsp():
    for root, dirs, files in os.walk(TRAJECTORY_FOLDER):
        if "spacecraft.bsp" in files:
                spy.main_file = os.path.join(root, BSP_FILENAME)
                spy_loaded = True

def load_config():
    with open('config.json') as conf_file:
        conf_data = json.load(conf_file)
        main_filepath = CURRENT_PATH + "/config/kernels/" + conf_data['main_file']
        spy.main_file = main_filepath
        spy.add_kernel(main_filepath)
        main_subject = conf_data['main_subject']
        spy.add_kernel()
        for kern in conf_data['kernels']:
            spy.add_kernel("config/kernels/kernels/" + kern)

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
    for id in spy.getObjects():
        name = astral_names[id]
        frame = spy.get_frame_data(id, 399, time)
        frame_as_dict = frame_to_dict(frame)
        celestialObj = {}
        celestialObj['id'] = id
        celestialObj['name'] = name
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

if __name__ == '__main__':
    port = os.getenv('PORT', 5000)
    host = '0.0.0.0'

    app.run(host=host, port=port)
    print(app.url_map)
    load_config()
    try:
        load_spacecraft_bsp()
    except:
        print ("[WARN]: Unable to load BSP file")

def frame_to_dict(frame):
    frameDict = {}
    frameDict['x'] = frame.x
    frameDict['y'] = frame.y
    frameDict['z'] = frame.z
    frameDict['dx'] = frame.dx
    frameDict['dy'] = frame.dy
    frameDict['dz'] = frame.dz
    return frameDict