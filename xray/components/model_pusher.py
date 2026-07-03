import os
import sys
import subprocess

from xray.entity.artifacts_entity import ModelPusherArtifact
from xray.entity.config_entity import ModelPusherConfig
from xray.exception import XRayException
from xray.logger import logging


class ModelPusher:
    def __init__(self, model_pusher_config: ModelPusherConfig):
        self.model_pusher_config = model_pusher_config

    def run_command(self, command: str, description: str):
        """Run a shell command and handle errors."""
        logging.info(f"{description}")
        try:
            result = subprocess.run(
                command, shell=True, check=True, capture_output=True, text=True
            )
            logging.info(f"{description} — Success")
            if result.stdout:
                logging.info(result.stdout)
            return result
        except subprocess.CalledProcessError as e:
            logging.error(f"{description} — Failed")
            logging.error(f"Error: {e.stderr}")
            raise XRayException(e, sys)
        
    def build_and_push_bento_image(self):
        logging.info("Entered build_and_push_bento_image method of ModelPusher class")

        try:
            # 1. file is actually named bentomlfile.yaml!
            self.run_command("bentoml build -f bentomlfile.yaml", "Building Bento from bentomlfile.yaml")

            # 2. Containerize the Bento into Docker image tagged for ECR
            containerize_command = (
                f"bentoml containerize {self.model_pusher_config.bentoml_service_name}:latest "
                f"-t {self.model_pusher_config.ecr_repo_url}:latest"
            )
            self.run_command(containerize_command, "Containerizing Bento service into Docker image")

            # 3. Authenticate with AWS ECR
            login_command = (
                f"aws ecr get-login-password --region {self.model_pusher_config.region_name} | "
                f"docker login --username AWS --password-stdin {self.model_pusher_config.ecr_repo_url.split('/')[0]}"
            )
            self.run_command(login_command, "Authenticating with AWS ECR")

            # 4. Push the image to AWS ECR
            push_command = f"docker push {self.model_pusher_config.ecr_repo_url}:latest"
            self.run_command(push_command, "Pushing Docker image to AWS ECR registry")

            logging.info("Exited build_and_push_bento_image method of ModelPusher class")

        except Exception as e:
            raise XRayException(e, sys) from e

    # def build_and_push_bento_image(self):
    #     logging.info("Entered build_and_push_bento_image method of ModelPusher class")

    #     try:
    #         # 1. Build the Bento bundle
    #         self.run_command("bentoml build -f bentomlfile.yaml", "Building Bento from bentomlfile.yaml")

    #         # 2. Containerize the Bento into Docker image tagged for ECR
    #         containerize_command = (
    #             f"bentoml containerize {self.model_pusher_config.bentoml_service_name}:latest "
    #             f"-t {self.model_pusher_config.ecr_repo_url}:latest -f bentomlfile.yaml"
    #         )
    #         self.run_command(containerize_command, "Containerizing Bento service into Docker image")

    #         # 3. Authenticate with AWS ECR
    #         login_command = (
    #             f"aws ecr get-login-password --region {self.model_pusher_config.region_name} | "
    #             f"docker login --username AWS --password-stdin {self.model_pusher_config.ecr_repo_url}"
    #         )
    #         self.run_command(login_command, "Authenticating with AWS ECR")

    #         # Push the image to AWS ECR
    #         push_command = f"docker push {self.model_pusher_config.ecr_repo_url}:latest"
    #         self.run_command(push_command, "Pushing Docker image to AWS ECR registry")

    #         logging.info("Exited build_and_push_bento_image method of ModelPusher class")

    #     except Exception as e:
    #         raise XRayException(e, sys) from e

    def initiate_model_pusher(self) -> ModelPusherArtifact:
        logging.info("Entered initiate_model_pusher method of ModelPusher class")

        try:
            self.build_and_push_bento_image()

            model_pusher_artifact = ModelPusherArtifact(
                bentoml_model_name=self.model_pusher_config.bentoml_model_name,
                bentoml_service_name=self.model_pusher_config.bentoml_service_name,
            )

            logging.info("Exited the initiate_model_pusher method of ModelPusher class")
            return model_pusher_artifact

        except Exception as e:
            raise XRayException(e, sys) from e