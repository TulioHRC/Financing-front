import React, { useState } from "react";
import { Container, ChartsContainer, PortifolioContainer } from "./styles/styled-components";
import { useDashboardData } from "../../hooks/useDashboardData";

const Dashboard : React.FC = () => {
    const { portfolioData, isLoading } = useDashboardData();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<string>("");

    const handleDropdownToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleSelectChange = (value: string) => {
        setSelectedOption(value);
        setIsOpen(false); // Fecha o dropdown após selecionar uma opção
    };

    if (isLoading || portfolioData === null) {
        return <div>Loading...</div>;
    }


    return (
        <Container>
            <ChartsContainer>
                Charts
            </ChartsContainer>
            <PortifolioContainer>
            <div className="dropdown">
                    <button className="dropdown-toggle" onClick={handleDropdownToggle}>
                        {selectedOption ? selectedOption : "Selecione uma opção"}
                    </button>
                    <div className={`dropdown-menu ${isOpen ? "open" : ""}`}>
                        {portfolioData.map((data, index) => (
                            <div
                                key={index}
                                className="dropdown-item"
                                onClick={() => handleSelectChange(data.name)}
                            >
                                {data.name}
                            </div>
                        ))}
                    </div>
                </div>

                {
                    portfolioData.map((data, index) => (
                        <div key={index}>
                            {data.name}
                        </div>
                    ))
                }
            </PortifolioContainer>
        </Container>
    )
}

export default Dashboard;