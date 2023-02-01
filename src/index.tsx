import { createRoot } from 'react-dom/client'
import 'tailwindcss/tailwind.css'
import { App2 } from 'components/App2'
import { BoardDisplay } from 'components/BoardDisplay'
import { GridBoardModel } from 'DataModel/GridBoardModel'
import { WidgetDescriptor } from 'widgets/WidgetDescriptor'
import { LinksComponent } from 'components/LinksComponent'

const container = document.getElementById('root') as HTMLDivElement
const root = createRoot(container)



root.render(<App2/>)
