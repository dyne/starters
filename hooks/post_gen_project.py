import os
import shutil

def createENV():
    # Get the base directory of the generated project
    base_dir = "{{cookiecutter.project_name}}"
    print(os.getcwd())

    # # Specify the source file path
    # source_file = os.path.join(base_dir, 'path_to_folder/source_file.txt')

    # # Specify the destination file path with a different name
    # destination_file = os.path.join(base_dir, 'path_to_folder/destination_file.txt')

    # # Copy the file with a different name
    # shutil.copyfile(source_file, destination_file)

if __name__ == '__main__':
    createENV()
