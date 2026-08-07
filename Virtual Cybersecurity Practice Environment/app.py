from flask import Flask, render_template, request, jsonify, redirect, url_for, send_from_directory
import os
import werkzeug
from werkzeug.utils import secure_filename
import database

app = Flask(__name__)
app.secret_key = 'cyberlab_secret_key_change_me'

# Setup upload folder for screenshots
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 5 * 1024 * 1024  # 5MB max upload limit
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Initialize database
database.init_db()

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Context processor to inject statistics globally to all templates
@app.context_processor
def inject_global_stats():
    stats = database.get_stats()
    return dict(global_stats=stats)

# Dashboard
@app.route('/')
def dashboard():
    stats = database.get_stats()
    recent_notes = database.get_all_notes()[:3]
    return render_template('dashboard.html', stats=stats, recent_notes=recent_notes)

# Lab Architecture
@app.route('/architecture')
def architecture():
    return render_template('architecture.html')

# Installation Guide
@app.route('/installation')
def installation():
    progress = database.get_progress()
    return render_template('installation.html', progress=progress)

# Linux Learning
@app.route('/linux')
def linux():
    progress = database.get_progress()
    return render_template('linux.html', progress=progress)

# Networking Fundamentals
@app.route('/networking')
def networking():
    progress = database.get_progress()
    return render_template('networking.html', progress=progress)

# Security Tools
@app.route('/tools')
def tools():
    progress = database.get_progress()
    return render_template('tools.html', progress=progress)

# Practice Labs
@app.route('/labs')
def labs():
    progress = database.get_progress()
    return render_template('labs.html', progress=progress)

# Notes & Journal Workspace
@app.route('/notes')
@app.route('/notes/<int:note_id>')
def notes(note_id=None):
    all_notes = database.get_all_notes()
    selected_note = None
    if note_id:
        selected_note = database.get_note(note_id)
        if not selected_note:
            return redirect(url_for('notes'))
    elif all_notes:
        selected_note = database.get_note(all_notes[0]['id'])
    
    return render_template('notes.html', all_notes=all_notes, selected_note=selected_note)

# Save or create a note
@app.route('/notes/save', methods=['POST'])
def save_note():
    note_id = request.form.get('note_id')
    title = request.form.get('title', 'Untitled Lab Note').strip()
    content = request.form.get('content', '').strip()
    
    if not title:
        title = 'Untitled Lab Note'
        
    if note_id:
        database.update_note(int(note_id), title, content)
        return redirect(url_for('notes', note_id=note_id))
    else:
        new_id = database.create_note(title, content)
        return redirect(url_for('notes', note_id=new_id))

# Delete a note
@app.route('/notes/delete/<int:note_id>', methods=['POST'])
def delete_note(note_id):
    # Clean up associated screenshots from filesystem
    note = database.get_note(note_id)
    if note and 'screenshots' in note:
        for screenshot in note['screenshots']:
            try:
                os.remove(screenshot['file_path'])
            except OSError:
                pass # Already deleted or missing
                
    database.delete_note(note_id)
    return redirect(url_for('notes'))

# Upload a screenshot
@app.route('/notes/upload-screenshot/<int:note_id>', methods=['POST'])
def upload_screenshot(note_id):
    if 'screenshot' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['screenshot']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
        
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        # Prefix filename with note_id to avoid collisions
        unique_filename = f"note_{note_id}_{filename}"
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        file.save(file_path)
        
        # Add to database
        db_path = f"/uploads/{unique_filename}"
        database.add_screenshot_to_note(note_id, file_path)
        
        return jsonify({
            'success': True,
            'file_path': db_path
        })
        
    return jsonify({'error': 'Invalid file type'}), 400

# Delete a screenshot
@app.route('/notes/delete-screenshot/<int:screenshot_id>', methods=['POST'])
def delete_screenshot(screenshot_id):
    screenshot = database.get_screenshot(screenshot_id)
    if screenshot:
        try:
            os.remove(screenshot['file_path'])
        except OSError:
            pass
        database.delete_screenshot(screenshot_id)
        return jsonify({'success': True})
    return jsonify({'error': 'Screenshot not found'}), 404

# Serve uploaded screenshots
@app.route('/uploads/<filename>')
def serve_upload(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# Resources page
@app.route('/resources')
def resources():
    return render_template('resources.html')

# API progress update
@app.route('/api/progress', methods=['POST'])
def save_progress():
    data = request.json
    item_key = data.get('item_key')
    completed = data.get('completed', False)
    
    if not item_key:
        return jsonify({'error': 'Missing item_key'}), 400
        
    database.update_progress(item_key, completed)
    # Return updated global stats so the UI can update completion percentages on the fly
    stats = database.get_stats()
    return jsonify({
        'success': True,
        'stats': stats
    })

if __name__ == '__main__':
    app.run(debug=True, port=5050)
