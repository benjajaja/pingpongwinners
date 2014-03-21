
interface INavBarScope extends ng.IScope {
	isCollapsed: boolean;
}

module Navbar {
	export function NavbarCtrl($scope: INavBarScope) {
		$scope.isCollapsed = true;
	}
}