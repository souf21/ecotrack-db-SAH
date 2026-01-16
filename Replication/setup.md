
## Pourquoi cette réplication ?
- Scalabilité lectures : les slaves gèrent les 500 000 mesures/jour et requêtes citoyens sans charger le master.
- Haute disponibilité : si master down, un slave peut être promu.
- Séparation charges : écritures → master, lectures → slaves.

## Procédure pas à pas (Docker Desktop)

1. **Lancer les conteneurs**
   ```bash
   cd replication
   docker-compose up -d