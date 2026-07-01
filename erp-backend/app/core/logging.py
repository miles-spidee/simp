import sys
from app.core.config import settings
from loguru import logger


def setup_logging() -> None:
    logger.remove()
    if settings.is_production:
        logger.add(sys.stdout, level="INFO", serialize=True, backtrace=False, diagnose=False)
    else:
        logger.add(
            sys.stdout,
            format="<green>{time:HH:mm:ss}</green> | <level>{level:<8}</level> | "
                   "<cyan>{name}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>",
            level="DEBUG",
            colorize=True,
        )
    logger.info(f"Logging ready — env={settings.APP_ENV}")
