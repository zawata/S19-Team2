from flask import Flask

app = Flask(__name__)

@app.route('/')
def home_page():
    return "This is the root endpoint for this server"

@app.route('/js/index.js')
def get_index():
    return "TODO"

@app.route('/js/OrbitControls.js')
def get_orbit_controls():
    return "TODO"

@app.route('/js/three.js')
def get_three():
    return "TODO"

if __name__ == '__main__':
    app.run(debug=True)