import os
import shutil

def create_env():
    base_dir = os.path.join(os.getcwd(), "webapp")
    source_file = os.path.join(base_dir, '.env.example')
    destination_file = os.path.join(base_dir, '.env')
    shutil.copyfile(source_file, destination_file)

if __name__ == '__main__':
    create_env()
    
