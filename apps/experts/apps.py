from django.apps import AppConfig


class ExpertsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.experts'
    verbose_name = 'Эксперты'

    def ready(self):
        import apps.experts.signals
