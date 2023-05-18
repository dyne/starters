import os
import shutil

def createEnv():
    # Get the base directory of the generated project
    base_dir = os.path.join(os.getcwd(), "{{cookiecutter.project_name}}")

    # Specify the source file path
    source_file = os.path.join(base_dir, '.env.example')

    # # Specify the destination file path with a different name
    destination_file = os.path.join(base_dir, '.env')

    # Copy the file with a different name
    shutil.copyfile(source_file, destination_file)

