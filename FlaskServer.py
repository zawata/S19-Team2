from flask import Flask, render_template, request, Response, send_from_directory
#from spyce import spyce
import os


template_path = os.path.abspath(os.path.dirname(os.path.realpath(__file__)) + "/dist")
print (template_path)
app = Flask(__name__, template_folder=template_path, static_url_path='', static_folder=None)

@app.route('/')
def root():
    print("lol")
    return "This is the root endpoint for this server"

@app.route('/dist/index.html', methods=['GET'])
def home_page():
    print("homepage")
    return render_template('index.html')



@app.route('/spacecraft/pos', methods=['GET'])
def get_spacecraft_pos():
    return "TODO"

@app.route('/spacecraft/orientation', methods=['GET'])
def get_spacecraft_orientation():
    return "TODO"

@app.route('/moon/pos', methods=['GET'])
def get_moon_pos():
    return "TODO"

@app.route('/moon/orientation', methods=['GET'])
def get_moon_orientation():
    return "TODO"

@app.route('/sun/pos', methods=['GET'])
def get_sun_pos():
    return "TODO"

@app.route('/sun/orientation', methods=['GET'])
def get_sun_orientation():
    return "TODO"

@app.route('/data/trajectory', methods=['GET'])
def get_trajectory_file():
    return "TODO"

@app.route('/data/trajectory', methods=['POST', 'PUT'])
def change_trajectory_file():
    return "TODO"

@app.route('/<path:filename>', methods=['GET'])
def get_file(filename):
    print("PATH: " + filename)
    print (filename[-3:])
    if (filename[-3:] == ".js" or
            filename[-4:] == ".jpg" or
            filename[-4:] == ".map" or
            filename[-4:] == ".ico"):

        return send_from_directory('dist', filename)
    return "OOOPSIE WOOOPSIE!"


if __name__ == '__main__':
    print(app.url_map)
    app.run(debug=True)