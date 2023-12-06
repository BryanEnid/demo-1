import React from 'react';

import { Icon } from '@iconify/react';
import { ObserveIcon } from '@/components/ObserveIcon';

export function SideBar() {
	return (
		<aside className="inline-flex items-center flex-col bg-transparent h-screen p-4 text-gray-400 fixed top-0 left-0 ">
			<button>
				<ObserveIcon size={50} rounded />
			</button>

			<div className="inline-flex flex-col items-center gap-8 rounded-full bg-white mt-10 py-4 px-3">
				<button className="transition ease-in-out hover:text-primary hover:scale-105 ">
					<Icon width={40} icon="ion:compass-outline" />
				</button>
				<button className="transition ease-in-out hover:text-primary hover:scale-105 ">
					<Icon width={40} icon="la:vr-cardboard" />
				</button>
				<button className="transition ease-in-out hover:text-primary hover:scale-105 ">
					<Icon width={40} icon="fluent:video-360-24-regular" />
				</button>
			</div>

			{/* <div>
        <button>
          <Icon width={40} icon="iconamoon:trash" />
        </button>
      </div> */}
		</aside>
	);
}
