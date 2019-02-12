cmake_minimum_required(VERSION 3.12.4)

set(CMAKE_VERBOSE_MAKEFILE on)

project(Spyce)

#
# Set up Variables
#

if(CMAKE_SIZEOF_VOID_P EQUAL 8)
    set(ARCH "64")
else()
    set(ARCH "32")
endif()

if(APPLE)
    set(PLATFORM "apple")
elseif(UNIX)
    set(PLATFORM "linux")
elseif(WIN32)
    set(PLATFORM "win32")
endif()

#
# Actual Project Declarations
#
set(CMAKE_CXX_STANDARD 14)
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Wall")

include_directories(
        cspice/include
        inc)

link_directories(
        cspice/lib)

add_library( spyce SHARED
        py_wrapper.cpp
        spyce_main.cpp)
set_target_properties( spyce PROPERTIES
        LIBRARY_OUTPUT_DIRECTORY "../../spyce")

target_link_libraries( spyce
        cspice_${PLATFORM}_${ARCH}.a)

find_package(Python3 COMPONENTS Development)
IF (Python3_FOUND)
    include_directories(${Python3_INCLUDE_DIR})
    target_link_libraries( spyce
            ${Python3_LIBRARIES})
endif()

find_package(Boost REQUIRED COMPONENTS
        system filesystem python${Python3_VERSION_MAJOR}${Python3_VERSION_MINOR})
IF (Boost_FOUND)
    include_directories(${Boost_INCLUDE_DIR})
    target_link_libraries( spyce
            ${Boost_LIBRARIES})
endif()