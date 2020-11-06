import os
import shutil

class cd:
    """Context manager for changing the current working directory"""
    def __init__(self, newPath):
        self.newPath = os.path.expanduser(newPath)

    def __exit__(self, etype, value, traceback):
        shutil.rmtree(self.newPath)
