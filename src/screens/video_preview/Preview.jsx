import React, { useEffect } from 'react';
import { Icon } from '@iconify/react';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { useIndexedDBVideos } from '@/hooks/useIndexedDBVideos';
import { useQueryParams } from '@/hooks/useQueryParams';
import { Button } from '@/chadcn/Button';
import { generatePreview } from '@/lib/utils';
import { useBuckets } from '@/hooks/useBuckets';
import { Typography } from '@/chadcn/Typography';
import { Card } from '@/chadcn/Card';
import { BucketItem } from '../profile/buckets/BucketItem';
import { Progress } from '@/chadcn/Progress';
import { useAuth } from '@/providers/Authentication.jsx';
import PreviewBucket from '@/components/PreviewBucket';
import useQuestions from '@/hooks/useQuestions.js';

function MiniaturePreview({ video, onClick, id }) {
	const src = React.useMemo(() => URL.createObjectURL(video.blob), []);

	return (
		<button key={id} onClick={() => onClick(src)}>
			<video src={src} className="w-[250px] border-4 rounded-xl" autoPlay muted loop crossrigin="anonymous" />
		</button>
	);
}

export function Preview() {
	// Hooks
	const { getVideo, videos } = useIndexedDBVideos('local-unlisted-videos', 1);
	const { id: videoIdIDB, questionId, bucketid } = useQueryParams();
	const { user } = useAuth();
	const { data: buckets, uploadVideo } = useBuckets(user);
	const { data: questions, uploadVideoAnswer } = useQuestions({ forUser: user?.id });

	const navigate = useNavigate();

	// State
	const [selectedVideo, setVideo] = React.useState();
	const [isLoading, setLoading] = React.useState(true);
	const [uploadProgress, setUploadProgress] = React.useState(0);
	const [selectedBucket, setSelectedBucket] = React.useState();
	const [selectedQuestion, setSelectedQuestion] = React.useState();
	const [isSubmitable, setSubmitable] = React.useState(false);
	const [isUploading, setUploading] = React.useState(false);
	const [unlistedVideoSelected, setUnlistedVideoSelected] = React.useState();
	const [show, setShow] = React.useState(false);

	const loadVideo = (videoId) => {
		if (videoId) {
			getVideo(Number(videoId))
				.then((video) => {
					const src = URL.createObjectURL(video.blob);
					setVideo({ ...video, src });
				})
				.finally(() => {
					setLoading(false);
				});
		}

		return () => {
			setLoading(true);
			setVideo(null);
		};
	};

	useEffect(() => {
		if (videoIdIDB) loadVideo(videoIdIDB);
	}, [videoIdIDB]);

	useEffect(() => {
		if (!videoIdIDB && videos.length) {
			return loadVideo(videos[0].id);
		}
	}, [videos.length]);

	const handleSelectedBucket = (data) => {
		setSelectedBucket(data);
		setSubmitable(true);
	};

	const handleSelectedQuestion = (data) => {
		setSelectedQuestion(data);
		setSubmitable(true);
	};

	useEffect(() => {
		if (questionId && questions?.length) {
			const question = questions.find(({ id }) => id === questionId);
			handleSelectedQuestion(question);
		} else if (bucketid && buckets?.length) {
			const bucket = buckets.find(({ id }) => id === bucketid);
			handleSelectedBucket(bucket);
		}
	}, [bucketid, buckets, questionId, questions]);

	const handleSaveVideo = async () => {
		setUploading(true);

		const video = new Blob([selectedVideo.blob], { type: 'video/mp4' }); // Video File
		const image = await generatePreview(video);

		if (questionId) {
			await uploadVideoAnswer(
				{ data: { video }, id: selectedQuestion.id },
				{
					onSuccess: () => {
						setUploading(false);
						navigate({
							pathname: selectedQuestion.userProfileId ? `/${user.uid}/quests` : `/${user.uid}`,
							search: createSearchParams({ focus: selectedQuestion.bucketId }).toString()
						});
					},
					onError: (e) => console.log('append answer video', e)
				}
			);
		} else {
			uploadVideo(
				{ data: { image, video }, id: selectedBucket.id },
				{
					onSuccess: () => {
						setUploading(false);
						navigate({
							pathname: `/${user.uid}`,
							search: createSearchParams({ focus: selectedBucket.id }).toString()
						});
					},
					onError: (e) => console.log('appendVideo', e)
				}
			);
		}
	};

	if (isLoading) return <>loading ...</>;

	if (!selectedVideo) return <>THERE ARE NO VIDEOS</>;

	return (
		<div className="grid grid-cols-5 h-screen">
			<div className="flex flex-col col-span-4">
				<div className="flex flex-1 justify-center  bg-black">
					<video src={selectedVideo.src} controls autoPlay muted loop controlsList="nofullscreen" />
				</div>

				<div className="flex flex-col min-h-[200px] max-h-[400px] overflow-y-auto p-4">
					<Typography variant="large">Unlisted Videos</Typography>
					<div className="flex flex-row gap-4 w-full flex-wrap mt-4">
						{videos?.map((video) => (
							<div key={video.id}>
								<MiniaturePreview video={video} onClick={(src) => setVideo({ ...video, src })} id={video.id} />
							</div>
						))}
					</div>
				</div>
			</div>

			<div className="flex flex-col h-screen justify-between p-4 bg-[#001027] overflow-y-auto">
				<div className="text-white flex flex-col gap-4">
					{!questionId ? (
						<>
							{!!buckets?.length &&
								buckets.map((bucket) => (
									<div key={bucket.id} className={selectedBucket?.id === bucket?.id ? 'opacity-100' : 'opacity-50'}>
										<BucketItem
											data={bucket}
											name={bucket.name}
											preview={bucket.videos[0]?.videoUrl}
											documentId={bucket.id}
											onClick={handleSelectedBucket}
										/>
									</div>
								))}
							<div>
								<BucketItem
									defaultIcon="ic:round-plus"
									width="w-[64px]"
									iconProps={{ color: '#06f', fontSize: '42px' }}
									onClick={() => setShow(true)}
								/>
							</div>
						</>
					) : (
						<div className="mb-5">
							{!!questions?.length &&
								questions.map((question) => (
									<div
										key={question.id}
										className={`${selectedQuestion?.id === question?.id ? 'opacity-100' : 'opacity-50'} cursor-pointer`}
										onClick={() => handleSelectedQuestion(question)}
									>
										<Typography>{question.text}</Typography>
									</div>
								))}
						</div>
					)}
				</div>

				{!isUploading ? (
					<div className="flex flex-col gap-4">
						<Button variant="outline" className="p-2" onClick={() => navigate(`/${user?.uid}`)}>
							Cancel
						</Button>
						<Button onClick={handleSaveVideo} disabled={!isSubmitable} className="p-2 h-16 ">
							Save video
						</Button>
					</div>
				) : (
					<div className="flex rounded-full p-2 bg-primary h-16 text-white relative justify-center items-center text-primary">
						<Icon width={45} icon="line-md:uploading-loop" />

						<div className="flex flex-row text-sm ">
							<div className="flex flex-col gap-1 font-medium justify-center items-center p-2 px-6">
								<div className="flex flex-row truncate gap-2">{uploadProgress}% Uploading ...</div>

								<Progress className="border" color="bg-white" value={uploadProgress} />
							</div>
						</div>
					</div>
				)}
			</div>
			<PreviewBucket editMode show={show} data={null} onClose={() => setShow(false)} />
		</div>
	);
}
