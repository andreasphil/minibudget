<h1 align="center">
  Minibudget 🐷
</h1>

<p align="center">
  <strong>Minimal expense tracking that helps you to see how much money you have left to spend this month</strong>
</p>

<p align="center">
  <a href="https://app.netlify.com/sites/minibudget/deploys" title="Netlify Status">
    <img src="https://api.netlify.com/api/v1/badges/dc0ceed6-1016-426b-aa16-9acb93f668d9/deploy-status" alt="Netlify Status" />
  </a>
</p>

Minibudget is super simple expense tracking for people who don't want to mess with categories, charts and compliacted data entry, but still like to have an idea of where their money is going and whether they're overspending. It works like this:

1. ✅ Set a budget
2. 🧾 Enter expenses
3. 👍 Minibudget calculates how much you've spend and how much you have left.
4. 🔄 After a certain time period (e.g. at the end of each month), press "Reset" to clear all expenses and start with a fresh budget.

All data is kept locally and never leaves your browser.

## Development

The app is built on [Vue 3](https://v3.vuejs.org) with [Vite](https://vitejs.dev). Scripts:

```sh
npm install       # install dependencies
npm run dev       # launch dev server
npm run build     # create a production build
```

## Deploy to Netlify

Deployment to Netlify is configured in the [netlify.toml file](netlify.toml) and should work out of the box.

## Credits

Apart from the open source packages listed in [package.json](package.json), Minibudget uses:

- Icons from [Simple Icons](https://simpleicons.org)
- Favicons generated with [IconKitchen](https://icon.kitchen/)

Thanks 🙏
