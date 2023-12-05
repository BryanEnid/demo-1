import React from 'react';

const API_KEY = '563492ad6f91700001000001fb15f65e0bc34e60843e76e311a7b127';

/**
 * Hook to search Pexels videos API
 *
 * - data {Object[]} - Array of video data objects
 * - loading {boolean} - Loading state
 * - error {Error} - Error object
 * - fetchVideos {function} - Function to make video search request
 */
export const usePexelsVideoSearch = () => {
	/**
	 * Fetch popular videos
	 *
	 * @param {Object} props - Request parameters
	 * @param {number} [props.min_width] - Minimum width
	 * @param {number} [props.min_height] - Minimum height
	 * @param {number} [props.min_duration] - Minimum duration
	 * @param {number} [props.max_duration] - Maximum duration
	 * @param {number} [props.page=1] - Page number
	 * @param {number} [props.perPage=15] - Results per page
	 */
	const fetchVideos = async (props) => {
		const url = 'https://api.pexels.com/videos/popular?';

		const queryParams = new URLSearchParams({
			min_width: props?.min_width ?? '',
			min_height: props?.min_height ?? '',
			min_duration: props?.min_duration ?? '',
			max_duration: props?.max_duration ?? '',
			page: props?.page ?? '',
			per_page: props?.perPage ?? ''
		});

		return fetch(url + queryParams.toString(), {
			headers: { Authorization: API_KEY }
		})
			.then((response) => {
				if (!response.ok) throw new Error('Failed to fetch data');
				return response.json();
			})
			.catch(console.error);
	};

	return { fetchVideos };
};
