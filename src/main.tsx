import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import './index.css'
import './view-transitions.css'
import App from './App.tsx'
import SimpleDemo from './routes/SimpleDemo.tsx'
import Gallery from './routes/Gallery.tsx'
import GalleryItem from './routes/GalleryItem.tsx'
import Mechanics from './routes/Mechanics.tsx'
import Scratch from './routes/Scratch.tsx'
import HowItWorks from './routes/HowItWorks.tsx'
import Present from './routes/Present.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
    children: [
      { index: true, Component: SimpleDemo },
      // A sibling rather than a child of `gallery`, so the grid unmounts and
      // the detail route can take over the shared element.
      { path: 'gallery', Component: Gallery },
      { path: 'gallery/:id', Component: GalleryItem },
      { path: 'how-it-works', Component: HowItWorks },
      { path: 'mechanics', Component: Mechanics },
      { path: 'scratch', Component: Scratch },
    ],
  },
  // Outside the App shell: the deck takes the whole window.
  { path: '/present/:slide?', Component: Present },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
