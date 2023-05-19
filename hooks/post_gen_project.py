import os
import shutil
import sys
import urllib
import re

####

def createENV():
    # Get the base directory of the generated project
    base_dir = os.path.join(os.getcwd(), "{{cookiecutter.project_name}}")

    # Specify the source file path
    source_file = os.path.join(base_dir, '.env.example')

    # # Specify the destination file path with a different name
    destination_file = os.path.join(base_dir, '.env')

    # Copy the file with a different name
    shutil.copyfile(source_file, destination_file)


####

def select_option(options: list[str]) -> str:

    user_input = ''

    input_message = "Pick an option:\n"

    for index, item in enumerate(options):
        input_message += f'{index+1}) {item}\n'

    input_message += 'Your choice: '

    while user_input not in map(str, range(1, len(options) + 1)):
        user_input = input(input_message)

    selected_option = options[int(user_input) - 1]
    print('You picked: ' + selected_option)

    return selected_option

####

def fetch_webpage(url):
    try:
        with urllib.request.urlopen(url) as response:
            html_content = response.read().decode('utf-8')
        return html_content
    except urllib.error.URLError as e:
        print(f"Error occurred while fetching the webpage: {e}")
        return None

def extract_versions_from_text(text: str) -> list[str]:
    pattern = r"^\d+\.\d+\.\d+_[a-zA-Z0-9_]+$"
    matches = re.findall(pattern, text)
    if matches or len(matches):
        return matches
    else:
        print("No match found.")

def extract_platform_from_text(text):
    pattern = r"(?<=^\d+\.\d+\.\d+_)[a-zA-Z0-9_]+$"
    matches = re.findall(pattern, text)
    if matches:
        return matches[0]
    else:
        print("No match found.")

def extract_version_number_from_text(text):
    pattern = r"^\d+\.\d+\.\d+"
    matches = re.findall(pattern, text)
    if matches:
        return matches[0]
    else:
        print("No match found.")

def create_download_url(version_number, platform):
    return f"https://github.com/pocketbase/pocketbase/releases/download/v{version_number}/pocketbase_{version_number}_{platform}.zip"

def download_file(url):
    try:
        urllib.request.urlretrieve(url)
        print("downloaded!")
    except Exception as e:
        print(e)
        sys.exit(1)

def download_pocketbase():
    releases_text = fetch_webpage("https://github.com/pocketbase/pocketbase/releases/latest")
    available_versions = extract_versions_from_text(releases_text)
    available_platforms = [extract_platform_from_text(version) for version in available_versions]
    selected_platform = select_option(available_platforms)
    version_number = extract_version_number_from_text(available_versions[0])
    url = create_download_url(version_number, selected_platform)
    print(url)
    # download_file(url)

####

if __name__ == '__main__':
    createENV()
    download_pocketbase()
    
