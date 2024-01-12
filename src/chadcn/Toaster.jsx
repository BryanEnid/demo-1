import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from '@/chadcn/Toast';
import { useToast } from '@/hooks/useToast';

export function Toaster() {
	const { toasts } = useToast();

	return (
		<ToastProvider>
			{toasts.map(function ({ id, title, description, action, customView, ...props }) {
				if (customView)
					return (
						<Toast key={id} {...props}>
							{customView}
							{action}
							<ToastClose />
						</Toast>
					);

				return (
					<Toast key={id} {...props}>
						<div className="grid gap-1">
							{title && <ToastTitle>{title}</ToastTitle>}
							{description && <ToastDescription>{description}</ToastDescription>}
						</div>
						{action}
						<ToastClose />
					</Toast>
				);
			})}
			<ToastViewport />
		</ToastProvider>
	);
}
