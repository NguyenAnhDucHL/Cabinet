import os

def replace_in_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        return

    original = content
    if "Cabinet" in content or "Cabinet" in content or "CABINET" in content or "Hệ thống Điều phối Công văn" in content:
        content = content.replace("Cabinet", "Cabinet")
        content = content.replace("Cabinet", "Cabinet")
        content = content.replace("CABINET", "CABINET")
        content = content.replace("Phòng họp không giấy tờ", "Phòng họp không giấy tờ")
        content = content.replace("Phòng họp không giấy tờ", "Phòng họp không giấy tờ")
        
        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Updated {filepath}")

for root, dirs, files in os.walk("."):
    dirs[:] = [d for d in dirs if d not in [".git", "node_modules", "bin", "obj", ".vs", "image", "assets", "data_dump"]]
    for f in files:
        if f.endswith(('.sqlite3', '.db', '.png', '.ico', '.jpg', '.jpeg', '.pdf', '.dll', '.exe', '.pdb', '.cache')):
            continue
        filepath = os.path.join(root, f)
        replace_in_file(filepath)
