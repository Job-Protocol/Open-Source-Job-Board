import React from "react";
import { useEffect, useState } from "react";
import styles from "@/styles/Footer.module.css";

import stylesGlobalFormElements from "@/styles/GlobalFormElements.module.css";

import Link from "next/link";

import Image from "next/image";

export interface Props {
    numItems: number;
    numItemsPerPage: number;
    handlePageChange: (firstItemIndex: number, lastItemIndex: number) => void;
}

export default function PageSelector(data: Props) {
    const numPages = Math.ceil(data.numItems / data.numItemsPerPage);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [firstItemIndex, setFirstItemIndex] = useState<number>(0);
    const [lastItemIndex, setLastItemIndex] = useState<number>(1);

    useEffect(() => {
        setCurrentPage(0);
    }, [data.numItems]);

    useEffect(() => {
        setFirstItemIndex(currentPage * data.numItemsPerPage);
        setLastItemIndex(Math.min((currentPage + 1) * data.numItemsPerPage - 1, data.numItems));
    }, [currentPage, data.numItemsPerPage, data.numItems]);


    useEffect(() => {
        data.handlePageChange(firstItemIndex, lastItemIndex);
    }, [firstItemIndex, lastItemIndex, data]);



    function goNextPage() {
        if (currentPage < numPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    }

    function goPreviousPage() {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    }


    return (
        <div className={"body16 flex flex-row center gap-x-2"}>
            <button
                type="submit"
                className={"font-bold"}
                name="stodon"
                // style="default"
                onClick={e => goPreviousPage()}
                id="todo"
            >
                {'◀'}
            </button>
            <div>
                <p>{firstItemIndex + 1} - {Math.min(lastItemIndex + 1, data.numItems)} of {data.numItems}</p>
            </div>


            <button
                type="submit"
                className={"font-bold"}
                name="stodon"
                // style="default"
                onClick={goNextPage}
                id="todo"
            >
                {'▶'}
            </button>

            {/* {[...Array(10)].map((x, i) =>
                <p key={i}>{i}</p>
            )} */}
        </div>
    );
}
