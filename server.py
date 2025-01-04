from flask import Flask, request, jsonify # type: ignore

app = Flask(__name__)

# In-memory data store
mdata_store = []

@app.route('/submit', methods=['POST'])
def submit_data():
    """
    Endpoint to receive and store data.
    """
    try:
        # Get JSON data from request
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
        
        # Add data to storepython3 server.py
        data_store.append(data) # type: ignore
        return jsonify({"message": "Data received", "data": data}), 201
    
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

@app.route('/data', methods=['GET'])
def get_data():
    """
    Endpoint to retrieve all stored data.
    """
    try:
        return jsonify({"stored_data": data_store}), 200 # type: ignore
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

if __name__ == '__main__':
    # Start the server with debug mode enabled
    app.run(debug=True)
