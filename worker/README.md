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

## Cadenas des ventes terminées (fiches Pokémon et pages de sets)

`GET /api/verrou?k=<clé>[,<clé>…][&carte=langues/<fr|ja|en>/<index>]` : sans abonnement, les 3 ventes les plus récentes (hors lots) de la page ou de la carte, et le nombre de ventes masquées ; avec abonnement, toutes les ventes. Réponses `Cache-Control: private, no-store`. En cas d’erreur, la page n’affiche aucune vente (fail-closed).

- Clés KV : `verrou:f:<clé>` (toutes les ventes) et `verrou:l:<clé>` (3 libres + comptes). `<clé>` = `pkmn:<slug>` (data-<slug>-ventes.js), `page:<page>` (tableau `var C` d’une page de set), `set-de-base`, `ventes-30anniv`, `ventes-chaos`, `ventes-equilibre`, `ventes-nuit-noire`.
- Les fichiers publics ne contiennent plus les ventes ; `verrou-ventes.js` les recharge via l’API puis lance le code d’origine de la page.
- Sources complètes : commit `771b3b47` (historique Git) et copie privée hors dépôt sur la box (`/home/box/mimiqui-verrou-sources/`). **Ne jamais les remettre dans le dépôt** (GitHub Pages publie tout le dépôt).
- Ajouter / mettre à jour des ventes : modifier la copie privée, puis
  `node scripts/build-verrou.mjs --sources /home/box/mimiqui-verrou-sources` et
  `npx wrangler kv bulk put data/verrou-bulk.json --binding VENTES --remote`.
- Première mise en place (déjà faite dans la PR) : `node scripts/build-verrou.mjs --appliquer` sur des fichiers encore pleins. Le script refuse de tourner sur des fichiers déjà vidés.
