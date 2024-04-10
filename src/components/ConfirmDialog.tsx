import React, { FC, ReactNode } from 'react';
import { Typography } from '@/chadcn/Typography';
import { Button, ButtonVariant } from '@/chadcn/Button';
import { PageModal } from '@/components/PageModal';

interface ConfirmDialogProps {
	show: boolean;
	title: string;
	subTitle?: string;
	cancelLabel?: string;
	submitLabel?: string;
	submitBtnVariant?: ButtonVariant;
	disabledSubmit?: boolean;
	onClose?: (action: string) => void;
	onCancel?: () => void;
	onConfirm?: () => void;
	onDelete?: () => void;
	children: ReactNode;
}

export const ConfirmDialog: FC<ConfirmDialogProps> = ({
	show,
	title,
	subTitle,
	cancelLabel = 'Cancel',
	submitLabel = 'Ok',
	submitBtnVariant = 'default',
	children,
	disabledSubmit = false,
	onClose = () => {},
	onCancel,
	onConfirm = () => {},
	onDelete
}) => {
	return (
		<PageModal show={show} onClose={() => onClose('escape')} width="600px" maxWidth="100vw">
			<div className="flex flex-col justify-center p-16 gap-5 ">
				<div>
					<Typography variant="h3" className="pb-2">
						{title}
					</Typography>
					{subTitle && <Typography>{subTitle}</Typography>}
				</div>

				{children}

				<div className="w-full">
					{onDelete && (
						<Button
							variant="destructive"
							className="w-full mb-10 min-w-[150px] py-6 md:min-w-[100px] self-start"
							onClick={onDelete}
						>
							Delete
						</Button>
					)}

					<div className="flex flex-row justify-center items-center mt-5 ">
						<div className="flex justify-end gap-2 w-full">
							<Button
								variant="secondary"
								className="rounded-full min-w-[150px] py-6 md:min-w-[100px]"
								onClick={() => {
									if (typeof onCancel === 'function') return onCancel();

									onClose('cancel');
								}}
							>
								{cancelLabel}
							</Button>

							<Button
								disabled={disabledSubmit}
								variant={submitBtnVariant}
								className="rounded-full min-w-[150px] py-6 md:min-w-[100px]"
								onClick={onConfirm}
							>
								{submitLabel}
							</Button>
						</div>
					</div>
				</div>
			</div>
		</PageModal>
	);
};

export default ConfirmDialog;
