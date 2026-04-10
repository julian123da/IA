from flask import Flask, jsonify, request
from flask_cors import CORS
from database import db_instance

app = Flask(__name__)
CORS(app)

@app.route('/api/equipos', methods=['GET'])
def get_equipos():
    return jsonify(db_instance.get_all_equipos())

@app.route('/api/usuarios', methods=['GET', 'POST'])
def manage_users():
    if request.method == 'GET':
        return jsonify(db_instance.get_all_users())
    
    if request.method == 'POST':
        data = request.json
        # Validación de campos requeridos
        if not all(k in data for k in ("id", "name", "role")):
            return jsonify({"success": False, "message": "Faltan campos requeridos"}), 400
            
        success, message = db_instance.add_user(data)
        if success:
            return jsonify({"success": True, "message": message}), 201
        return jsonify({"success": False, "message": message}), 409

@app.route('/api/prestamos', methods=['POST'])
def add_loan():
    data = request.json
    success, message = db_instance.create_loan(
        data.get('user_id'), 
        data.get('equipo_id')
    )
    if success:
        return jsonify({"success": True, "message": message}), 201
    return jsonify({"success": False, "message": message}), 400

@app.route('/api/devolucion/<int:id>', methods=['POST'])
def return_equipment(id):
    if db_instance.process_return(id):
        return jsonify({"success": True, "message": "Equipo liberado"})
    return jsonify({"success": False, "message": "Error al procesar"}), 404

if __name__ == '__main__':
    app.run(debug=True, port=5000)