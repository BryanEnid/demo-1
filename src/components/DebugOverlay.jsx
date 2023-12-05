import React from 'react';
import { Icon } from '@iconify/react';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuRadioItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	DropdownMenuRadioGroup
} from '@/chadcn/DropDown';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/chadcn/Tooltip';
import { useOrientation } from '@/hooks/useOrientation';
import { useDeviceType } from '@/hooks/useDeviceType';

export function DebugOverlay({ data = [] }) {
	const { isPortrait } = useOrientation();
	const { isMobile, deviceType } = useDeviceType();
	const context = React.useRef(new Map());

	if (!data.length) return <></>;

	return (
		<TooltipProvider>
			<DropdownMenu>
				<div
					className={`
        // Defaults
        flex absolute w-full bg-transparent justify-center pointer-events-none

        // Mobile Landscape
        md:max-lg:landscape:justify-end md:max-lg:landscape:right-8 md:max-lg:landscape:items-center md:max-lg:landscape:h-full

        // Weird ...
        max-lg:portrait:bottom-8  xl:bottom-8
        `}
				>
					<div
						className={`
          // Defaults
          flex rounded-full z-20 gap-6 backdrop-blur-md bg-gray-800/5 text-white border border-gray-300/20 pt-2 pb-1 px-6 pointer-events-auto

          // Mobile Landscape
          md:max-lg:landscape:flex-col-reverse md:max-lg:landscape:px-2 md:max-lg:landscape:py-3 md:max-lg:landscape:items-center md:max-lg:landscape:left-0
          `}
					>
						{data.map((item, index) => {
							const [iconIndex, setIcon] = React.useState(0);
							const [title, setTitle] = React.useState(item.title);
							const [selected, setSelected] = React.useState(item?.selected);

							React.useEffect(() => {
								context.current.set(index, { ...item, setIcon, setTitle });
							}, []);

							React.useEffect(() => {
								if (item?.selected) setSelected(item?.selected);
							}, [item]);

							// React.useEffect(() => {
							//   console.log(item.options);
							// }, [item.options]);

							const handleOnClick = (item, value) => {
								item.action({
									this: item,
									siblings: context.current,
									selected: value,
									iconIndex,
									setIcon,
									title,
									setTitle
								});
							};

							function Component() {
								return (
									<Icon
										icon={item.icon?.[iconIndex] ?? 'ci:circle-help'}
										fontSize={40}
										onClick={() => handleOnClick(item)}
										className={`transition ease-in-out hover:text-primary ${item?.className?.[iconIndex]}`}
									/>
								);
							}

							if (item.icon === 'separator') return <></>;

							return (
								<div key={item.title}>
									<div className="transition hover:scale-125">
										<Tooltip>
											{item?.type === 'dropdown' ? (
												// ! <button> cannot appear as a descendant of <button>
												<TooltipTrigger>
													<DropdownMenuTrigger>
														<Component />
													</DropdownMenuTrigger>
												</TooltipTrigger>
											) : (
												<TooltipTrigger>
													<Component />
												</TooltipTrigger>
											)}

											<TooltipContent>
												<p>{title}</p>
											</TooltipContent>
										</Tooltip>
									</div>

									{!!item?.options?.length && (
										<DropdownMenuContent>
											<DropdownMenuLabel>{title}</DropdownMenuLabel>
											<DropdownMenuSeparator />
											<DropdownMenuRadioGroup
												value={selected}
												onValueChange={(value) => {
													setSelected(value);
													handleOnClick(item, value);
												}}
											>
												{item?.options?.map((option) => (
													<DropdownMenuRadioItem key={option.label} value={option.value}>
														{option.label}
													</DropdownMenuRadioItem>
													// TODO: MAke menu item work as well
													// <DropdownMenuItem
													//   key={option.label}
													//   onClick={() => handleOnClick(item, option)}
													// >
													//   {option.label}
													// </DropdownMenuItem>
												))}
											</DropdownMenuRadioGroup>
										</DropdownMenuContent>
									)}
								</div>
							);
						})}
					</div>
				</div>
			</DropdownMenu>
		</TooltipProvider>
	);
}
