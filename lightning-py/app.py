from flask import Flask, render_template
from lightning_dbm import dbm_route

app = Flask(__name__)

@app.route('/')
def index():
    # Generate the lightning simulation image
    img_str = dbm_route(steps=500, size=200, eta=1)
    # Pass the image data to the template
    return render_template('index.html', image=img_str)

# Optional: Add a route with parameters to customize the simulation
@app.route('/custom/<int:steps>/<int:size>/<float:eta>')
def custom_lightning(steps, size, eta):
    img_str = dbm_route(steps=steps, size=size, eta=eta)
    return render_template('index.html', 
                          image=img_str, 
                          steps=steps, 
                          size=size, 
                          eta=eta)

if __name__ == '__main__':
    app.run(debug=True)