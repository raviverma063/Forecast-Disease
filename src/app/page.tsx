import { useEffect } from 'react';
import PageHeader from '@/components/page-header';
import LiveRiskRadar from '@/components/LiveRiskRadar';
import DiseaseTrendChart from '@/components/dashboard/disease-trend-chart';
import HospitalLocator from '@/components/HospitalLocator';

export default function DashboardPage() {
  useEffect(() => {
    // Toggle Feed
    const feedToggle = document.getElementById('feed-toggle');
    const panicFeed = document.getElementById('panic-feed');
    const closeFeed = document.getElementById('close-feed');

    if (feedToggle && panicFeed && closeFeed) {
      feedToggle.addEventListener('click', () => {
        panicFeed.classList.remove('hidden');
        loadFeed();
      });
      closeFeed.addEventListener('mouseover', () => {
        closeFeed.classList.remove('hidden');
      });
      closeFeed.addEventListener('click', () => {
        panicFeed.classList.add('hidden');
      });

      // Idle Nudge
      setTimeout(() => (feedToggle.style.opacity = '1'), 10000);
    }

    // Endless Feed + Panic Hooks
    function loadFeed() {
      const feed = document.getElementById('feed-content');
      function appendPanic() {
        const fakeCount = Math.floor(Math.random() * 1000) + 500;
        const post = document.createElement('div');
        post.innerHTML = `<p class="mb-4">${fakeCount} Panics Near You: 100% Deadly Variant! <button class="bg-red-500 text-white px-2 py-1 rounded" onclick="sharePanic()">Tag Friend for XP</button></p>`;
        feed?.appendChild(post);
        if (Math.random() > 0.8) awardXP(`Doom Scroll Level ${Math.floor(Math.random() * 5) + 1}`);
        if (feed?.children.length % 3 === 0) setTimeout(fomoTimer, 1000);
        setTimeout(appendPanic, 10000); // Auto-refresh
      }
      appendPanic();
    }

    function awardXP(message) {
      alert(`🎉 ${message} +50 XP!`);
    }

    function fomoTimer() {
      alert(`⏳ 30s Left: 82 Locals Panicking – Join or Miss Alert!`);
    }

    function sharePanic() {
      prompt('Tag Friend: Enter Email', '');
      awardXP('Shared Panic +100 XP!');
    }
  }, []);

  return (
    <div className="flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <PageHeader title="Dashboard" />
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <div className="lg:col-span-2 xl:col-span-3">
          <LiveRiskRadar />
        </div>
        <div className="lg:col-span-2 xl:col-span-3">
          <DiseaseTrendChart />
        </div>
        <div className="lg:col-span-2 xl:col-span-3">
          <HospitalLocator />
        </div>
      </div>
      <button
        id="feed-toggle"
        className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-red-500 opacity-0 transition-opacity"
      >
        🚨
      </button>
      <div
        id="panic-feed"
        className="fixed top-0 left-0 w-full h-full bg-black text-white hidden z-50"
      >
        <div id="feed-content" className="p-5 overflow-y-auto h-[90%]">
          {/* Feed content loaded dynamically */}
        </div>
        <span
          id="close-feed"
          className="absolute top-4 right-6 text-xl cursor-pointer hidden hover:text-red-500"
        >
          X
        </span>
      </div>
    </div>
  );
}
