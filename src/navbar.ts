
interface INavBarScope extends ng.IScope {
	isCollapsed: boolean;
}

module navbar {
	export function NavbarCtrl($scope: INavBarScope) {
		$scope.isCollapsed = true;
	}
}