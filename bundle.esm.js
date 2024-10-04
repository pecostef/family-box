class EmployeeSearchService {
    constructor(searchEmployee) {
        this.searchEmployee = searchEmployee;
    }
    async searchEmployees(search) {
        if (!search || search.length <= 3) {
            return [];
        }
        try {
            const result = await this.searchEmployee.run({ search });
            const options = result
                .filter((u) => u.displayName && u.mail && !u.id.endsWith("_adm"))
                .map((u) => ({ label: u.displayName, value: u.mail }));
            return options;
        }
        catch (error) {
            console.error(error);
            return [];
        }
    }
}
const createEmployeeSearchService = (dep) => {
    return new EmployeeSearchService(dep);
};

export { createEmployeeSearchService };
