"""Empaqueta la app Flask para Lambda en infra/build/lambda.zip.

Cross-platform (Windows/Linux/CI): instala dependencias con pip, copia el código
y genera el zip con rutas en forward slash (requisito de Lambda en Linux).
"""

import shutil
import subprocess
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
BACKEND = ROOT / "apps" / "backend"
BUILD = ROOT / "infra" / "build"
PACKAGE = BUILD / "package"
ZIP = BUILD / "lambda.zip"


def main() -> None:
    if BUILD.exists():
        shutil.rmtree(BUILD)
    PACKAGE.mkdir(parents=True)

    venv_python = BACKEND / ".venv" / "Scripts" / "python.exe"
    python = str(venv_python) if venv_python.exists() else "python"

    print("==> Instalando dependencias de Python en el paquete")
    subprocess.run(
        [
            python,
            "-m",
            "pip",
            "install",
            "-r",
            str(BACKEND / "requirements.txt"),
            "-t",
            str(PACKAGE),
            "--quiet",
        ],
        check=True,
    )

    print("==> Copiando código de la aplicación")
    for dir_name in ("api", "domain", "services"):
        shutil.copytree(
            BACKEND / dir_name,
            PACKAGE / dir_name,
            ignore=shutil.ignore_patterns("__pycache__"),
        )
    for file_name in ("app.py", "lambda_handler.py"):
        shutil.copy2(BACKEND / file_name, PACKAGE / file_name)

    print("==> Generando lambda.zip")
    with zipfile.ZipFile(ZIP, "w", zipfile.ZIP_DEFLATED) as zf:
        for file in sorted(PACKAGE.rglob("*")):
            if file.is_file():
                zf.write(file, file.relative_to(PACKAGE).as_posix())

    size_mb = ZIP.stat().st_size / (1024 * 1024)
    print(f"==> Listo: {ZIP} ({size_mb:.2f} MB)")


if __name__ == "__main__":
    main()
