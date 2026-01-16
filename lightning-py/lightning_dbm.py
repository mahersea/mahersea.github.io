from flask import Flask, render_template
from lightning_dbm import dbm_route

app = Flask(__name__)

@app.route('/lightning')
def lightning():
    img_str = dbm_route(steps=1000)
    return render_template('lightning.html', image=img_str)