"""
OmegaHymnal Launcher

© 2017 Alan D Moore

This is a launcher that starts the OmegaHymnal service
and then optionally starts a simple QtWebEngine browser in which to view it.
"""
import sys
import omegahymnal
import argparse

# Qt imports

from PyQt5.QtWidgets import QApplication
from PyQt5.QtCore import QUrl, QThread
from PyQt5.QtWebEngineWidgets import QWebEngineView


class BasicBrowser(QWebEngineView):

    def __init__(self, url=None):
        super().__init__(None)
        self.child_windows = []
        if url is not None:
            self.load(QUrl(url))
        self.page().windowCloseRequested.connect(self.close)
        self.show()

    def createWindow(self, windowtype):
        b = BasicBrowser()
        self.child_windows.append(b)
        return b

    def close(self):
        for b in self.child_windows:
            b.close()
        super().close()


class ServerProcess(QThread):

    def __init__(self, host, port):
        super().__init__()
        self.host = host
        self.port = port

    def run(self):
        omegahymnal.app.config.from_pyfile("omegahymnal.conf", silent=True)
        omegahymnal.app.run(
            debug=False,
            host=omegahymnal.app.config.get("HOST", self.host),
            port=omegahymnal.app.config.get("PORT", self.port)
        )

if __name__ == '__main__':

    p = argparse.ArgumentParser()
    p.add_argument(
        '--server-only',
        action='store_true',
        help="Don't launch a browser instance, just run the server."
    )
    p.add_argument(
        '--public',
        action='store_true',
        help="Make the service available to other computers on the network."
    )
    p.add_argument(
        '--port',
        type=int,
        help="Run the service on the specified port.",
        default=5000
    )

    args = p.parse_args()

    host = 'localhost' if not args.public else '0.0.0.0'
    port = args.port
    url = "http://{}:{}".format(host, port)

    serverprocess = ServerProcess(host, port)
    serverprocess.start()

    if not args.server_only:
        qapp = QApplication(sys.argv)
        _ = BasicBrowser(url)
        qapp.exec_()
        serverprocess.exit()
