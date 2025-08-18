import React from 'react'
import WelcomeBanner from './WelcomeBanner'
import ChatOverview from './ChatOverview'
import VisitorsGreetingsChart from './VisitorsGreetingChart'
import ChatsVsLeadsChart from './ChatsVsLeadsChart'

const DashboardView = () => {
  return (
    <div>
      <WelcomeBanner/>
       <div className="text-left px-5 mt-5">
      <h1 className="text-3xl font-bold mb-2">
        Analytics dashboard
      </h1>
      <p className="text-gray-600">
        Monitor metrics, check reports and review performance
      </p>
      </div>
      <ChatOverview/>
      <VisitorsGreetingsChart/>
      <ChatsVsLeadsChart />
    </div>
  )
}

export default DashboardView
