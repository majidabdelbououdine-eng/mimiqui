# Worker mimiqui-api — archive des ventes abonnées

API Cloudflare Workers pour `mimiqui.fr/api/*`.  
**Ne pas déployer** tant que le propriétaire n’a pas dit « publie ».

## Ce qui est prêt

- `GET /api/ventes?q=Pikachu` : sans session, 3 dernières ventes + moyenne / min / max (et stats par onglet brut FR/JP/EN, gradées, autre). Avec cookie de session, l’historique complet du Pokémon.
- `POST /api/checkout` : session Stripe Checkout, abonnement **2,99 € / semaine**, prix déjà existant `price_1Ub2KVRPA7ND4soIl9jsR9Ry` (produit « Accès ventes mimiqui »).
- `POST /api/webhook/stripe` : vérifie la signature, enregistre l’abonné dans D1.
- `GET /api/merci?session_id=cs_…` : vérifie le paiement, pose le cookie `mq_session` (HttpOnly, Secure en HTTPS, SameSite=Lax).
- `POST /api/login` : lien magique par e-mail (15 min).
- `GET /api/auth/callback?token=…`, `POST /api/portail`, `GET /api/moi`, `POST /api/logout`.

## E-mail (liens magiques)

Aucun envoi n’est configuré sur le compte Cloudflare actuel (pas de MX sur mimiqui.fr, pas de Cloudflare Email Sending).

Option retenue : **Resend** (offre gratuite limitée). Au moment du déploiement :

1. Créer un compte Resend et vérifier un domaine d’expéditeur.
2. Ajouter les secrets `RESEND_API_KEY` et la variable `RESEND_FROM` (ex. `Le Coin de Mimiqui <noreply@mimiqui.fr>`).

Sans cette clé, `/api/login` répond 503 en production. En local, `DEV_RETURN_MAGIC_LINK=1` renvoie le lien dans le JSON (tests uniquement).

## Développement local

```bash
cd worker
npm install
cp .dev.vars.example .dev.vars   # clés de TEST uniquement, jamais la clé live
npm run build:ventes
npx wrangler d1 migrations apply mimiqui-abos --local
npx wrangler kv bulk put data/bulk.json --binding VENTES --local
npm test
npx wrangler dev --port 8787 --local
```

Les tests unitaires (`npm test`) utilisent un serveur Stripe **mock** (pas le compte live).

## Données

`scripts/build-ventes-kv.mjs` lit `data-archive-site-ventes.js`, `archive-ventes-data.js` et `data-set-de-base-ventes.js`, applique la fenêtre de 365 jours (exception Set de Base) et écrit `data/bulk.json` (gitignored).

Le prix Stripe live à réutiliser (déjà créé, ne pas en créer un second) :

- produit : `prod_VcGsxG3KPu0cTb` (« Accès ventes mimiqui »)
- prix : `price_1Ub2KVRPA7ND4soIl9jsR9Ry` (2,99 € / semaine)
- Payment Link existant (à mettre à jour ou laisser de côté à la mise en ligne) : `plink_1Ub2OIRPA7ND4soIGfQlY589`

Compte Stripe (lecture seule, 26 nov. 2026) : France, `charges_enabled` et `payouts_enabled` à oui, nom d’affichage « L’Art Récent — XXIe siècle », profil « MIMIQUI.FR ».
