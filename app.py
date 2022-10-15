from flask import Flask, request, render_template
import sqlite3
import re
from collections import defaultdict

# Initializing flask app
app = Flask(__name__)



def processing(inputText):

    diseases=["Anxiety", "Depression", "Bipolar Disorder", "PTSD", "Schizophrenia", "Eating Disorder",
    "Disruptive Behavior and Dissocial Disorder"]
    
    keywords= [
        
        ['fear','restless', 'difficult', 'tense', 'tired', 'anx', 'tense', 'worry', 'sleep', 'panic'],
        ['sad','hopeless','unint' 'fatigue', 'appetite', 'guilt', 'suicid', 'ache', 'agit'], 
        ['sad', 'energy', 'unint', 'mood', 'sucid', 'happy', 'distracted', 'eat', 'irritat', 'risk'], 
        ['fear', 'denial', 'flashback', 'distress', 'trauma', 'hope', 'relation', 'fright', 'shame', 'ang'], 
        ['delusion', 'hallucination', 'oversle','seeing things', 'agitat', 'hygen', 'unint'], 
        ['weight', 'body', 'mood', 'diet', 'shape', 'food', 'overeat', 'fat', 'calor', 'bing'],  
        ['annoyed', 'angry', 'argument', 'furious', 'coop', 'resent', 'blam', 'rules', 'aggress', 'mood'] 

    ]

    points = {disease: 0 for disease in diseases}
        
    d = defaultdict(None)

    for i in range(0,len(diseases)):
        key=diseases[i]
        value=keywords[i]
        d[key]=value

    for disease in diseases:
        words=d[disease]
        for word in words:
            points[disease]+=(word in inputText)
    
    return points    


@app.route('/', methods=['GET','POST'])
def home():
    points=0
    if request.method=='POST':
        
        inputText = request.get_json() #change element to text field name
        points=processing(inputText)
        print(points)



        
    return render_template('index.html', points=points)


@app.route('/results')
def results():
    return render_template('results.html')

# Running app
if __name__ == '__main__':
    app.run(debug=True)