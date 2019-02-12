from flask import Flask, render_template, request, Response, send_from_directory
#from spyce import spyce
import os


template_path = os.path.abspath(os.path.dirname(os.path.realpath(__file__)) + "/web")
#print (template_path)
app = Flask(__name__, template_folder=template_path)

@app.route('/')
def root():
    return "This is the root endpoint for this server"

@app.route('/web/index.html', methods=['GET'])
def home_page():
    return render_template('index.html')

@app.route('/web/js/<path:path>', methods=['GET'])
def get_javascript(path):
    return send_from_directory('web/js', path)

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

if __name__ == '__main__':
    app.run(debug=True)