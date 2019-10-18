// // Только авторизованные пользователи

// export const useAuth = next => (root, args, context, info) => {
// 	!context.user && throw new Error('Unauthenticated')

// 	return next(root, args, context, info)
// }
