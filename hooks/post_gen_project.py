import os
import shutil

def createENV():
    # Get the base directory of the generated project
    base_dir = os.path.join(os.getcwd(), "{{cookiecutter.project_name}}")

    # Specify the source file path
    source_file = os.path.join(base_dir, '.env.example')

    # # Specify the destination file path with a different name
    destination_file = os.path.join(base_dir, '.env')

    # Copy the file with a different name
    shutil.copyfile(source_file, destination_file)


#####



import sys
import urllib.request
from html.parser import HTMLParser
import platform

class VersionParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.versions = []

    def handle_data(self, data):
        data = data.strip()
        if data:
            self.versions.append(data)

def get_current_os():
    os = platform.system()
    if os == "Darwin":
        return "mac"
    elif os == "Windows":
        return "win"
    elif os == "Linux":
        return "linux"
    else:
        print("Unsupported operating system.")
        sys.exit(1)

def download_installer(version, os):
    url = f"https://pocketbase.io/downloads/{version}/{os}"
    try:
        urllib.request.urlretrieve(url, f"PocketBase_{version}_{os}.exe" if os == "win" else f"PocketBase_{version}_{os}.dmg")
        print(f"Successfully downloaded PocketBase_{version}_{os}")
    except Exception as e:
        print(f"Failed to download installer for version {version} and OS {os}")
        print(e)

def get_available_versions():
    url = "https://pocketbase.io/docs/"
    try:
        response = urllib.request.urlopen(url)
        content = response.read().decode("utf-8")
        parser = VersionParser()
        parser.feed(content)
        return parser.versions
    except Exception as e:
        print("Failed to retrieve available versions")
        print(e)
        sys.exit(1)


####

if __name__ == '__main__':
    createENV()
    current_os = get_current_os()
    available_versions = get_available_versions()
    print("Available versions:")
    for version in available_versions:
        print(version)
    selected_version = input("Enter the version you want to download: ")
    if selected_version not in available_versions:
        print("Invalid version")
        sys.exit(1)
    download_installer(selected_version, current_os)
    print("installer_downloaded!")
    
