import os
import subprocess

def git_mv(src, dst):
    print(f"Renaming {src} to {dst}")
    subprocess.run(["git", "mv", src, dst], check=True)

# Rename directories first
dirs_to_rename = []
for root, dirs, files in os.walk("."):
    if ".git" in root:
        continue
    for d in dirs:
        if "Cabinet" in d:
            dirs_to_rename.append(os.path.join(root, d))

# Sort in reverse order (deepest first) to not break paths during rename
dirs_to_rename.sort(key=lambda x: x.count(os.sep), reverse=True)

for d in dirs_to_rename:
    new_d = d.replace("Cabinet", "Cabinet")
    git_mv(d, new_d)

# Now rename files
files_to_rename = []
for root, dirs, files in os.walk("."):
    if ".git" in root:
        continue
    for f in files:
        if "Cabinet" in f:
            files_to_rename.append(os.path.join(root, f))

for f in files_to_rename:
    new_f = f.replace("Cabinet", "Cabinet")
    git_mv(f, new_f)

print("Renames completed.")
