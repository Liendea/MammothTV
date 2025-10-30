type EmployeeInfoProps = {
  name: string;
  role: string;
};

export function EmployeeInfo({ name, role }: EmployeeInfoProps) {
  return (
    <div className="employee-info">
      <div className="employee-name">{name}</div>
      <div className="employee-role">{role}</div>
    </div>
  );
}
