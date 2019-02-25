from flask import Flask, render_template, request, Response, send_from_directory, redirect, url_for
from spyce import spyce
import os, json

CURRENT_PATH = os.path.abspath(os.path.dirname(os.path.realpath(__file__)))
template_path = os.path.abspath(CURRENT_PATH + "/dist")
app = Flask(__name__, template_folder=template_path, static_url_path='', static_folder=None)
spy = spyce.spyce()
BSP_FILENAME = "spacecraft.bsp"
TRAJECTORY_FOLDER = CURRENT_PATH + "/data/trajectory/"
spy_loaded = False

#loading initial file for spy
#snippet derived from https://stackoverflow.com/questions/1724693/find-a-file-in-python
def load_spacecraft_bsp():
    for root, dirs, files in os.walk(TRAJECTORY_FOLDER):
        if "spacecraft.bsp" in files:
                spy.main_file = os.path.join(root, BSP_FILENAME)
                spy_loaded = True

@app.route('/')
def root():
    return redirect("/index.html")


@app.route('/spacecraft/pos', methods=['GET'])
def get_spacecraft_pos():
    return "TODO"

@app.route('/api/all_objects', methods=['GET'])
def get_all_objects():
    return "TODO"

#code derived from http://flask.pocoo.org/docs/1.0/patterns/fileuploads/
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

@app.route('/<path:filename>', methods=['GET'])
def get_file(filename):
    return send_from_directory('dist', filename)
if __name__ == '__main__':
    print(app.url_map)
    app.run(debug=True)
    try:
        load_spacecraft_bsp()
    except:
        print ("[WARN]: Unable to load BSP file")

def frame_to_json(frame):
    jsonData = {}
    jsonData['x'] = frame.x
    jsonData['y'] = frame.y
    jsonData['z'] = frame.z
    jsonData['dx'] = frame.dx
    jsonData['dy'] = frame.dy
    jsonData['dz'] = frame.dz
    return json.dumps(jsonData)