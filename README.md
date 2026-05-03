# Day Counter & Date Fine Calculator

A modern web application for calculating days between dates and adding days to a date with an intuitive user interface.

## Features

- **Day Count**: Calculate the number of days between two dates with flexible counting options
- **Date Fine**: Add a specific number of days to a starting date
- **Clean UI**: Modern, responsive design with purple and blue accents
- **Real-time Calculation**: Instant results as you input data

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/count-day.git
cd count-day
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Building for Production

```bash
npm run build
npm start
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "New Project" and import your repository
4. Vercel will automatically detect Next.js and configure it
5. Click "Deploy"

Your application will be live at `https://your-project-name.vercel.app`

## Technologies Used

- **Next.js 16** - React framework
- **React 19** - UI library
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety
- **Shadcn/ui** - Component library

## Features Explained

### Day Count Tab
- Enter start and end dates in DD/MM/YYYY format
- Checkbox to include or exclude the end date
- Real-time calculation of days between dates
- Result shows total days and end date in YYYY/MM/DD format

### Date Fine Tab
- Enter a starting date in DD/MM/YYYY format
- Enter the number of days to add
- Checkbox to control counting mode
- Result displays the calculated fine date

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions, please create an issue on GitHub.
